const checkData = (e) => {
  e.preventDefault(); // stop normal form submission

  // Clear errors
  document.getElementById("nameErr").innerHTML = "";
  document.getElementById("emailErr").innerHTML = "";
  document.getElementById("mobErr").innerHTML = "";
  document.getElementById("dateErr").innerHTML = "";
  document.getElementById("timeErr").innerHTML = "";
  document.getElementById("diseaseErr").innerHTML = "";

  let nm = document.frm.name.value.trim();
  let email = document.frm.email.value.trim();
  let mob = document.frm.mobile.value.trim();
  let date = document.frm.date.value;
  let time = document.frm.time.value;
  let disease = document.frm.disease.value.trim();

  let status = 0;

  // Name
  let namePattern = /^[A-Za-z]+$/;
  if(nm === ""){
    document.getElementById("nameErr").innerHTML = "Enter Name";
    status = 1;
  } else if(nm.length <= 2){
    document.getElementById("nameErr").innerHTML = "Name must be > 2 chars";
    status = 1;
  } else if(!namePattern.test(nm)){
    document.getElementById("nameErr").innerHTML = "Only alphabets allowed";
    status = 1;
  }

  // Email
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(email === ""){
    document.getElementById("emailErr").innerHTML = "Enter Email";
    status = 1;
  } else if(!emailPattern.test(email)){
    document.getElementById("emailErr").innerHTML = "Enter valid Email";
    status = 1;
  }

  // Mobile
  let mobPattern = /^[0-9]{10,12}$/;
  if(mob === ""){
    document.getElementById("mobErr").innerHTML = "Enter Mobile";
    status = 1;
  } else if(!mobPattern.test(mob)){
    document.getElementById("mobErr").innerHTML = "Enter 10 digit number";
    status = 1;
  }

  // Date & Time
  if(date === ""){
    document.getElementById("dateErr").innerHTML = "Select Date";
    status = 1;
  }
  if(time === ""){
    document.getElementById("timeErr").innerHTML = "Select Time";
    status = 1;
  }

  // Disease
  if(disease === ""){
    document.getElementById("diseaseErr").innerHTML = "Enter Disease Info";
    status = 1;
  } else if(disease.length > 30){
    document.getElementById("diseaseErr").innerHTML = "Max 30 chars allowed";
    status = 1;
  }

  if(status === 0){
    saveData(); // store in localStorage
    window.open("viewAppointments.html", "_blank"); // redirect
  }
};
