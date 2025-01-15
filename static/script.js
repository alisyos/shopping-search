document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const loading = document.getElementById('loading');
    const optimizedQueryDiv = document.getElementById('optimizedQuery');
    const optimizedQueryText = document.getElementById('optimizedQueryText');
    
    // 검색 시작 시 로딩 표시
    loading.classList.remove('d-none');
    resultsDiv.innerHTML = '';
    optimizedQueryDiv.style.display = 'none';
    
    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `query=${encodeURIComponent(searchInput.value)}`
        });
        
        const data = await response.json();
        
        // 최적화된 검색어 표시
        optimizedQueryText.textContent = data.optimized_query;
        optimizedQueryDiv.style.display = 'block';
        
        // 결과 표시
        resultsDiv.innerHTML = data.items.map(item => `
            <div class="col-md-3">
                <div class="card product-card">
                    <img src="${item.image}" class="card-img-top product-image" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title product-title">${item.title}</h5>
                        <p class="card-text price">${parseInt(item.lprice).toLocaleString()}원</p>
                        <a href="${item.link}" class="btn btn-sm btn-primary w-100" target="_blank">
                            구매하기
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    검색 중 오류가 발생했습니다.
                </div>
            </div>
        `;
        console.error('Error:', error);
    } finally {
        loading.classList.add('d-none');
    }
}); 