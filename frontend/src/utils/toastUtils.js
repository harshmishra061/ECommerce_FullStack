import { toast } from 'react-toastify'

const showToast = (message, type = 'default') => {
    switch (type) {
        case 'success':
            toast.success(message)
            break
        case 'error':
            toast.error(message)
            break
        case 'info':
            toast.info(message)
            break
        case 'warning':
            toast.warning(message)
            break
        default:
            toast(message)
    }
}

export default showToast
