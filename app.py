from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import requests
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = Flask(__name__)

# OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# 네이버 API 설정
NAVER_CLIENT_ID = os.getenv('NAVER_CLIENT_ID')
NAVER_CLIENT_SECRET = os.getenv('NAVER_CLIENT_SECRET')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    
    # OpenAI를 사용하여 검색어 최적화 (gpt-4o로 변경)
    response = client.chat.completions.create(
        model="gpt-4o",  # 정확히 gpt-4o로 변경
        messages=[
            {"role": "system", "content": "쇼핑 검색어를 최적화해주세요. 사용자의 자연어 검색을 네이버 쇼핑에 적합한 검색어로 변환해주세요."},
            {"role": "user", "content": query}
        ]
    )
    
    optimized_query = response.choices[0].message.content
    
    # 네이버 쇼핑 API 호출
    url = "https://openapi.naver.com/v1/search/shop.json"
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }
    params = {
        "query": optimized_query,
        "display": 20
    }
    
    naver_response = requests.get(url, headers=headers, params=params)
    result = naver_response.json()
    
    # 최적화된 검색어를 결과에 포함
    result['optimized_query'] = optimized_query
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True) 