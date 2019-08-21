import Worker from 'worker-loader!../lib/notification'

const notificatioWorker = new Worker()
window.notificatioWorker = notificatioWorker
