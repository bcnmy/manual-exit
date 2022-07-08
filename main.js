import "./style.css";

const app = document.querySelector("#app");
const manualExitForm = app.querySelector("#form");
const message = app.querySelector(".message");

async function handleFormSubmit(e) {
  e.preventDefault();

  const inputs = e.target.elements;
  const depositHash = inputs["depositHash"].value;
  const fromChainId = inputs["fromChainId"].valueAsNumber;

  const requestData = {
    depositHash,
    fromChainId,
  };

  const res = await window.fetch(
    "https://hyphen-v2-api.biconomy.io/api/v1/insta-exit/execute",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );

  if (res.ok) {
    const data = await res.json();
    const exitHash = data.exitHash;
    message.textContent = `Exit hash: ${exitHash}`;
    message.className = "message success";
  } else {
    message.textContent = `Error: ${res.status}`;
    message.className = "message error";
  }
}

manualExitForm?.addEventListener("submit", handleFormSubmit);
