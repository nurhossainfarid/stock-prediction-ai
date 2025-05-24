import { dates } from "/utils/dates";
import OpenAI from "openai";

const tickersArr = [];

const generateReportBtn = document.querySelector(".generate-report-btn");

generateReportBtn.addEventListener("click", fetchStockData);

document.getElementById("ticker-input-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const tickerInput = document.getElementById("ticker-input");
  if (tickerInput.value.length > 2) {
    generateReportBtn.disabled = false;
    const newTickerStr = tickerInput.value;
    tickersArr.push(newTickerStr.toUpperCase());
    tickerInput.value = "";
    renderTickers();
  } else {
    const label = document.getElementsByTagName("label")[0];
    label.style.color = "red";
    label.textContent =
      "You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.";
  }
});

function renderTickers() {
  const tickersDiv = document.querySelector(".ticker-choice-display");
  tickersDiv.innerHTML = "";
  tickersArr.forEach((ticker) => {
    const newTickerSpan = document.createElement("span");
    newTickerSpan.textContent = ticker;
    newTickerSpan.classList.add("ticker");
    tickersDiv.appendChild(newTickerSpan);
  });
}

const loadingArea = document.querySelector(".loading-panel");
const apiMessage = document.getElementById("api-message");

async function fetchStockData() {
  document.querySelector(".action-panel").style.display = "none";
  loadingArea.style.display = "flex";
  try {
    const stockData = await Promise.all(
      tickersArr.map(async (ticker) => {
        const url = `https://polygon-api-worker.guil-9d2.workers.dev/?ticker=${ticker}&startDate=${dates.startDate}&endDate=${dates.endDate}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error("Worker error: " + errMsg);
        }
        apiMessage.innerText = "Creating report...";
        return response.text();
      })
    );
    fetchReport(stockData.join(""));
  } catch (err) {
    loadingArea.innerText = "There was an error fetching stock data.";
    console.error("error: ", err);
  }
}

async function fetchReport(data) {
  const messages = [
    {
      role: "system",
      content:
        "You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.",
    },
    {
      role: "user",
      content: `${data}
            ###
            OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
            ###
            Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
            ###
            `,
    },
  ];
  try {
    const url =
      "https://openai-worker-ai.httpsnurhossainworkersdev.workers.dev/";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Worker error: ${data.error}`);
    }

    renderReport(data.content);
  } catch (error) {
    console.log(error);
  }
}

function renderReport(output) {
  loadingArea.style.display = "none";
  const outputArea = document.querySelector(".output-panel");
  const report = document.createElement("p");
  outputArea.appendChild(report);
  report.textContent = output;
  outputArea.style.display = "flex";
}

// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// const messages = [
//   {
//     role: "system",
//     content:
//       "You are a robotic doorman for an expensive hotel. When a customer greets you, respond to them politely. Use examples provided between ### to set the style and tone of your response.",
//   },
//   {
//     role: "user",
//     content: `Good day!
//       ###
//         Good evening kind Sir. I do hope you are having the most tremendous day and looking forward to an evening of indulgence in our most delightful of restaurants.
//       ###

//       ###
//         Good morning Madam. I do hope you have the most fabulous stay with us here at our hotel. Do let me know how I can be of assistance.
//       ###

//       ###
//         Good day ladies and gentleman. And isn't it a glorious day? I do hope you have a splendid day enjoying our hospitality.
//       ###
//     `,
//   },
// ];

// const response = await openai.chat.completions.create({
//   model: "gpt-4.1",
//   messages: messages,
//   temperature: 1.1,
// });

// console.log("Response: ", response.choices[0].message.content);

// import OpenAi from "openai";
// import OpenAI from "openai";

// const openai = new OpenAi({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// const messages = [
//   {
//     role: "system",
//     content:
//       "You are a rap genius. When give a topic, you will 5 line write a rap about it.",
//   },
//   {
//     role: "user",
//     content: "Television",
//   },
// ];

// const response = await openai.chat.completions.create({
//   model: "gpt-4.1",
//   messages: messages,
// });

// // console.log(response.choices[0].message.content);

// /**
//  * @param {string} topic - What to explain
//  * @param {string} audience - who the explanation is for
//  * @param {number} maxTokens - max token length for output
//  */

// async function explainTopic(topic, audience = "10-year-old", maxTokens = 300) {
//   const prompt = `Explain ${topic} to a ${audience} in simple terms. Keep it clear, friendly, and within ${maxTokens} tokens.`;

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4.1",
//     messages: [
//       {
//         role: "system",
//         content: "You are a friendly and clear teacher.",
//       },
//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//     max_tokens: maxTokens,
//     temperature: 0.7,
//   });

//   console.log("Explanation:", completion.choices[0].message.content);
// }

// explainTopic("Quantum Computing", "10-year-old", 250);

// Fine-tuning example

// import OpenAI from "openai";

// const openai = new OpenAI({ dangerouslyAllowBrowser: true });

/* Upload training data */
// const upload = await openai.files.create({
//     file: await fetch("/motivationalBotData.jsonl"),
//     purpose: "fine-tune"
// })
// console.log(upload)

// const upload_id = "file-MSkeJ8DRcmgFkGcdjit2Wa";
/* Use file ID to create job */
// const fineTune = await openai.fineTuning.jobs.create({
//     training_file: "file-MSkeJ8DRcmgFkGcdjit2Wa",
//     model: "gpt-3.5-turbo"
// })

// console.log(fineTune)

// const fineTune_id = "ftjob-zuCmZZpt1n5bO0V1GwAHqmAh";
// /* Check status of job */
// // const fineTuneStatus = await openai.fineTuning.jobs.retrieve("ftjob-zuCmZZpt1n5bO0V1GwAHqmAh")
// // console.log(fineTuneStatus)

// const fineTuneModel = "ftjob-zuCmZZpt1n5bO0V1GwAHqmAh";
// /* Test our fine-tuned model */
// const messages = [
//   {
//     role: "user",
//     content: "I don't know what to do with my life",
//   },
// ];
// async function getResponse() {
//   const response = await openai.chat.completions.create({
//     model: "ft:gpt-3.5-turbo-0125:scrimba::96fwXrQX",
//     messages: messages,
//   });
//   return response.choices[0].message.content;
// }
// console.log(await getResponse());
