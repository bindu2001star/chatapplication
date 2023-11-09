
async function login(e) {
    e.preventDefault();
    const logindetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:3004/user/login",
        logindetails
      );
      if (response.status === 201) {
        // alert(response.data.message);
        alert("login successfully");
        displaymessage(response.data.message,true)
        localStorage.setItem("token", response.data.token);
        window.location.href='../chathome/home.html'
      }
    } catch (err) {
      console.log("error in login",err);
      displaymessage(err.response.data.message, false)
    }
  }
  async function displaymessage(msg, successorfailure) {
    const errordiv=document.getElementById('message');
    errordiv.innerHTML='';
    if(successorfailure){
        errordiv.innerHTML += `<h3>${msg}</h3>`
    }else{
        errordiv.innerHTML += `<h3>${msg}</h3>`
    }
  }