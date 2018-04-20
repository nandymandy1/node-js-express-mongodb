if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://<nandymandy>:<nandymandy>@ds151809.mlab.com:51809/vid-jot'}
} else {
    module.exports = {mongoURI:'mongodb://127.0.0.1:27017/vidjot-dev'}
}

