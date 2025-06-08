const swiperText = new Swiper('.swiper', {
    speed: 900,
    mousewheel: { },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        prevEl : '.swiper-button-prev',
        nextEl: '.swiper-button-next'
    }
})
const human = document.getElementById("human");
const tree = document.getElementById("tree");
const game = document.getElementById("game");
tree.style.animationPlayState = "paused";
const start = document.getElementById("btn-game");
let isAlive;
let isRun = false;

function jump() {
    if (human.classList != "jump") {
        human.classList.add("jump")
    }
    setTimeout (function() {
        human.classList.remove("jump")
    }, 500)
}


function endGame() {
    isRun = false;
    clearInterval(isAlive);
    tree.style.animation = "none";
    document.removeEventListener("keydown", jumpFun);
    alert("GAME OVER!");
}
function jumpFun(event) {
    if (event.code === "Space"){
        jump();
    }
}

start.addEventListener('click', function() {
    if (isRun) return;

    isRun = true;
    tree.style.animation = "treeMov 1s infinite linear";
    tree.style.animationPlayState = "running";
    document.addEventListener("keydown", jumpFun);

    isAlive = setInterval(function() {

    let humanRect = human.getBoundingClientRect();
    let treeRect = tree.getBoundingClientRect();
    
    if (
        humanRect.right > treeRect.left + 20 && 
        humanRect.left < treeRect.right - 20 && 
        humanRect.bottom > treeRect.top + 20
    ) {
        endGame();
    }
}, 10);
})

function colors() {
    const red = document.getElementById('red').value;
    const green = document.getElementById('green').value;
    const blue = document.getElementById('blue').value;
    const colors = 'rgb(' + red + ',' + green + ',' + blue + ')';
    document.querySelector('.container').style.backgroundColor = colors;
    document.getElementById('result').value = colors;
}   
document.getElementById('red').addEventListener('input', colors);
document.getElementById('green').addEventListener('input', colors);
document.getElementById('blue').addEventListener('input', colors);


const feedbackButton = document.getElementById("feedback-button");
  const feedbackModal = document.getElementById("feedback-modal");
  const closeModalfeedback = document.querySelector(".feedback-close");

  feedbackButton.addEventListener("click", () => {
    const userEmail = localStorage.getItem("user");
    if (userEmail) {
      const user = JSON.parse(localStorage.getItem(userEmail));

      document.getElementById("feedback-name").value = user.firstName;
      document.getElementById("feedback-email").value = user.email;
    } else {
      document.getElementById("feedback-name").value = "";
      document.getElementById("feedback-email").value = "";
    }

    feedbackModal.style.display = "flex";
  });

  closeModalfeedback.addEventListener("click", () => {
    feedbackModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === feedbackModal) {
      feedbackModal.style.display = "none";
    }
  });

  
  document.getElementById("feedback-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("feedback-name").value.trim();
    const email = document.getElementById("feedback-email").value.trim();
    const message = document.getElementById("feedback-message").value.trim();

    const namePattern = /^[А-ЯЁ][а-яё]+$/;
    if (!namePattern.test(name)) {
      alert("Имя должно начинаться с заглавной буквы и содержать только буквы!");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Пожалуйста, введите корректный email!");
      return;
    }

    if (message.length < 5) {
      alert("Сообщение должно содержать не менее 5 символов!");
      return;
    }

    const text = `Новое сообщение от ${name} (${email}): ${message}`;
    const token = "8181012222:AAEbvmvDuNhgRV4Fl9-msjcu3uWG4AP5FCg";
    const chatId = "1000604653";

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("Сообщение отправлено!");
          feedbackModal.style.display = "none";
        } else {
          alert("Ошибка при отправке сообщения.");
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.");
      });
  });
  
  let lastUpdateId = 0;

function getUpdates() {
  fetch(`https://api.telegram.org/bot8181012222:AAEbvmvDuNhgRV4Fl9-msjcu3uWG4AP5FCg/getUpdates?offset=${lastUpdateId + 1}`)
    .then(response => response.json())
    .then(data => {
      if (data.ok && data.result.length > 0) {
        data.result.forEach(update => {
          console.log("Новое сообщение:", update.message.text);
          lastUpdateId = update.update_id;
        });
      }
    })
    .catch(error => console.error("Ошибка:", error));
}
setInterval(getUpdates, 5000);
