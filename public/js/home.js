fetch("C:\\Users\\Nyxwh\\OneDrive\\Escritorio\\Bakend\\Entrega 1\\data\\products.json")
.then(response => response.json())
.then(products => {
    const template = Handlebars.compile(document.getElementById("products-template").innerHTML);
    const html = template({ products: products });
    document.getElementById("products-container").innerHTML = html;
})
.catch(error => console.error('Error fetching products:', error));