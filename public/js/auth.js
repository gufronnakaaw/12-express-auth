const ShowPassword = document.querySelector('.show-password')
const InputPassword = document.querySelector('input[type=password]')
const RepeatPassword = document.querySelector('input[name=repeat_password]')
const FormRegister = document.querySelector('.form-register')


if(ShowPassword){
    ShowPassword.addEventListener('click', function(){
        (this.checked) ? InputPassword.type = 'text' : InputPassword.type = 'password'
    })
}

if(FormRegister){

    FormRegister.addEventListener('submit', function(e){

        if(InputPassword.value !== RepeatPassword.value) {
            e.preventDefault()
            showError('Password doesnt match')
            return
        }

    })
}

document.addEventListener('click', function (e) {
    if (e.target.className == 'close' || e.target.className == 'span-close') {
        document.querySelector('.alert-dismissible').style.display = 'none';
    }
});

function showError(message){
    const alert = `<div class="alert alert-danger mb-4 alert-dismissible fade show" role="alert">
    <strong>${message}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true" class="span-close">&times;</span>
    </button>
    </div>`

    document.querySelector('.illustration').insertAdjacentHTML('afterend', alert)
}