// Шо зыришь?:)

async function sendMessage(message) {
	const url = 'https://chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com/v1/chat/completions';
	const options = {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'X-RapidAPI-Key': '0495e71fd4msh9127ce256ec6809p145fe3jsn0936ca9c317b',
			'X-RapidAPI-Host': 'chatgpt-chatgpt3-5-chatgpt4.p.rapidapi.com'
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: message }],
			temperature: 0.8,
			stream: false
		})
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();
		const content = data.choices[0].message.content;

		let requestField = document.getElementById('chat-output');
		requestField.innerText = content;
		requestField.classList.remove('fade-in-animation');
		requestField.classList.add('fade-in-animation');
	} catch (error) {
		console.error(error);
	}
}

function addPromt(promt) {
	let messageField = document.getElementById('chat-request');
	let newPromt = promt.replace('[expression]', document.getElementById('result').innerHTML);

	messageField.value += newPromt;
}

function sendMessageToChat() {
	let message = `${document.getElementById('chat-request').value}`;
	sendMessage(message);
}