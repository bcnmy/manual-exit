import "./style.css";

window.addEventListener("load", init);

async function fetchNetworks() {
  const res = await window.fetch(
    "https://hyphen-v2-api.biconomy.io/api/v1/configuration/networks"
  );

  const data = await res.json().catch((err) => console.error(err));
  return data.message;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const networksSelect = document.querySelector("#from-chain");
  const submitBtn = document.querySelector(".submit-btn");
  const message = document.querySelector(".message");

  const inputs = e.target.elements;
  const depositHash = inputs["depositHash"].value;
  const fromChainId = networksSelect.value;
  message.className = "message";

  const requestData = {
    depositHash,
    fromChainId,
  };

  submitBtn.textContent = "Submitting...";
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
  submitBtn.textContent = "Submit";

  const data = await res.json().catch((err) => console.error(err));

  if (res.ok) {
    const exitHash = data.exitHash;
    message.textContent = `Exit hash: ${exitHash}`;
    message.className = "message success";
  } else {
    message.textContent = data
      ? `Error: ${res.status}. ${data.message}`
      : `Error: ${res.status}`;
    message.className = "message error";
  }
}

async function init() {
  const networks = await fetchNetworks();
  const manualExitForm = document.querySelector("#form");
  const networksSelect = document.querySelector("#from-chain");

  networks.forEach((network) => {
    networksSelect.add(new Option(network.name, network.chainId));
  });

  manualExitForm.addEventListener("submit", handleFormSubmit);
}
