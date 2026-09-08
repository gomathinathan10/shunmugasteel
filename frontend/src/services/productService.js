import api from './api'

export const productService = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getFeaturedProducts: () => api.get('/products?featured=1'),
  searchProducts: (q) => api.get(`/products?search=${q}`),
  calculatePrice: (data) => api.post('/quotes/calculate', {
    items: [{
      product_id: data.product_id,
      quantity:   data.quantity,
      is_custom:  true,
      specs: {
        thickness: data.thickness,
        width:     data.width,
        length:    data.length,
      },
    }],
  }),
}
