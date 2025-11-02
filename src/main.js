import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'sweetalert2/dist/sweetalert2.min.css';


import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';
import './styles/hero-icon.css'
import './styles/swal-custom.css';

const app = createApp(App)

app.use(router)

app.mount('#app')
