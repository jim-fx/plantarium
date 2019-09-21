import "./popup.scss";
import icon from "../../assets/icons";

const wrapper = <HTMLElement>document.getElementById("popup-wrapper");

export default function(msg: string, type: string = "info") {
  const p = document.createElement("div");
  p.classList.add("popup");

  const iconWrapper = document.createElement("span");
  const progressBar = document.createElement("div");
  progressBar.classList.add("popup-progress");

  let time = 2000;

  switch (type) {
    case "success":
      p.classList.add("popup-success");
      iconWrapper.append(icon.checkmark);
      break;
    case "info":
      p.classList.add("popup-info");
      break;
    case "sync":
      p.classList.add("popup-sync");
      break;
    case "error":
      p.classList.add("popup-error");
      console.error(msg);
      iconWrapper.append(icon.cross);
      time = 3000 + msg.length * 50;
      break;
    default:
      break;
  }

  progressBar.style.transition = `width ${time}ms linear`;

  const text = document.createElement("p");
  text.innerHTML = msg;

  p.append(iconWrapper);
  p.append(text);

  p.append(progressBar);

  wrapper.insertBefore(p, wrapper.firstChild);

  setTimeout(() => {
    progressBar.classList.add("popup-progress-extend");
    setTimeout(() => {
      p.classList.add("popup-out");
      setTimeout(() => {
        p.remove();
      }, 300);
    }, time);
  }, 50);
}
