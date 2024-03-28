function addToCart(productId) {
    fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId }) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar el producto al carrito');
        }
       
        console.log('Producto agregado al carrito:', productId);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function initializeProductsView() {
    const addToCartButtons = document.querySelectorAll('.product button'); 

    addToCartButtons.forEach(button => { 
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id'); 
            
            addToCart(productId);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => { 
    initializeProductsView();
});
