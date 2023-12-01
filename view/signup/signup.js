let signupform = document.getElementById("signupForm");
      signupform.addEventListener("submit", signup);
      async function signup(e) {
        e.preventDefault();
        const signupdetails = {
          name: e.target.name.value,
          email: e.target.email.value,
          phoneNumber: e.target.phoneNumber.value,
          password: e.target.password.value,
        };
        try {
          const response = await axios.post(
            "http://3.80.199.53:3004/user/signup",
            signupdetails
          );
          console.log(response, "ressssssss");
          if (response.status === 201) {
            alert(response.data.response.name);
            // alert("Successfully signed up! Please Login",response.data.response.name);
            window.location.href='../Login/login.html';
          }
        } catch (err) {
          console.log(err.message);
          alert(
            "User already signed up. Please go to the login page.",
            err.message
          );
          window.location.href='../Login/login.html';
        }
      }