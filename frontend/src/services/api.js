import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (data) => api.post('/auth/login', data)

// Tests
export const getTests = () => api.get('/tests/')
export const createTest = (data) => api.post('/tests/', data)
export const updateTest = (id, data) => api.put(`/tests/${id}`, data)
export const deleteTest = (id) => api.delete(`/tests/${id}`)

// Medicines
export const getMedicines = () => api.get('/medicines/')
export const createMedicine = (data) => api.post('/medicines/', data)
export const updateMedicine = (id, data) => api.put(`/medicines/${id}`, data)
export const deleteMedicine = (id) => api.delete(`/medicines/${id}`)

// Bookings
export const createBooking = (data) => api.post('/bookings/', data)
export const getBookings = () => api.get('/bookings/')
export const getBookingsByContact = (contact) => api.get(`/bookings/by-contact/${contact}`)
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status })
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)

// Medicine Requests
export const createMedicineRequest = (data) => api.post('/medicine-requests/', data)
export const getMedicineRequests = () => api.get('/medicine-requests/')
export const getMedicineRequestsByContact = (contact) => api.get(`/medicine-requests/by-contact/${contact}`)
export const updateMedicineRequestStatus = (id, status) => api.put(`/medicine-requests/${id}/status`, { status })
export const deleteMedicineRequest = (id) => api.delete(`/medicine-requests/${id}`)

// Messages
export const sendMessage = (data) => api.post('/messages/', data)
export const getMessages = () => api.get('/messages/')
export const replyToMessage = (id, reply) => api.put(`/messages/${id}/reply`, { reply })
export const deleteMessage = (id) => api.delete(`/messages/${id}`)

export default api
