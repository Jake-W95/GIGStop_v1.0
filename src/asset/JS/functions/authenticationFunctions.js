
const showForm = (form) => {
    let header
    let formId
    let submitId
    let submitText

    if (form === 'showSignUp') {
        header = 'Sign Up'
        formId = 'signUpForm'
        submitId = 'submitSignUp'
        submitText = 'Sign Up'
    }
    if (form === 'showLogin') {
        header = 'Log In'
        formId = 'loginForm'
        submitId = 'submitLogin'
        submitText = 'Log In'
    }

    let html = `
    <section id="authFormDiv">
        <h1>${header}</h1>
        <form class="authForm" id="${formId}">
                <label for="email">Email</label>
                <input type="text" placeholder="Email" id="email">
                <label for="password">Password</label>
                <input type="password" placeholder="Password" id="password">
                <button id="${submitId}">${submitText}</button>
        </form>
    </section>
    `
    $(document.body).append(html)
}

const entryHtml = (newUser) => {
    let greetVariant 
    newUser ? greetVariant = '' : greetVariant = ' back'
    return `
    <div 
    id="welcome"
    style="
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin:auto;
    width:20%;
    height:30%;
    background-color:grey;
    color:red">  
        <h2>Welcome${greetVariant} to GIGStop</h2>
    </div>
    `
} 
const submitSignUp = (auth, createUserFunc) => {
    const email = $('#email').val();
    const password = $('#password').val()
    createUserFunc(auth, email, password)
        .then((cred) => {
            console.log('success')
            $(document.body).append(entryHtml(true))
            setTimeout(() => {
                $('#welcome').remove()
            }, 2000)
        })
        .catch((err) => {
            console.log(err)
        })
}
const submitLogIn = (auth, logInFunc) => {
    const email = $('#email').val()
    const password = $('#password').val()

    logInFunc(auth, email, password)
        .then((cred) => {
            $(document.body).append(entryHtml(false))
            setTimeout(() => {
                $('#welcome').remove()
            }, 2000)
        })
        .catch((err) => {
            console.log(err)
        })
}


export { showForm, submitSignUp, submitLogIn }