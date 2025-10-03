// Save patient data
const saveData = () => {
  let nm = document.frm.name.value;
  let email = document.frm.email.value;
  let mob = document.frm.mobile.value;
  let date = document.frm.date.value;
  let time = document.frm.time.value;
  let disease = document.frm.disease.value;

  let allData =JSON.parse(localStorage.getItem("patientInfo")) ||  [];
  let len = allData.length > 0 ? allData[allData.length - 1].id + 1 : 1;
  let obj = { id:len, name: nm, email:email, mobile: mob, date :date, time:time, disease:disease };

  allData.push(obj);
  localStorage.setItem("patientInfo", JSON.stringify(allData));
  
  document.frm.reset()
  
};


// Display data
const display = () => {
  let dt = localStorage.getItem("patientInfo");
  if(!dt) return;

  let res = JSON.parse(dt);
  let tr = "";

  res.forEach((i) => {
    tr += `<tr>
      <td>${i.id}</td>
      <td>${i.name}</td>
      <td>${i.email}</td>
      <td>${i.mobile}</td>
      <td>${i.date}</td>
      <td>${i.time}</td>
      <td>${i.disease}</td>
      <td><button class="btn btn-sm btn-danger" onclick="delData(${i.id})">Delete</button></td>
    </tr>`;
  });

  document.getElementById("allData").innerHTML = tr;
};

// Delete one record
const delData = (id) => {
  let dt = JSON.parse(localStorage.getItem("patientInfo")) || [];
  let newDt = dt.filter((item) => item.id !== id);
  localStorage.setItem("patientInfo", JSON.stringify(newDt));
  display();
};
