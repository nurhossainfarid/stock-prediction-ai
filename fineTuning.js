import OpenAI from "openai";

const openai = new OpenAI({ dangerouslyAllowBrowser: true });

/* Upload training data */
// const upload = await openai.files.create({
//     file: await fetch("/motivationalBotData.jsonl"),
//     purpose: "fine-tune"
// })
// console.log(upload)

const upload_id = "file-MSkeJ8DRcmgFkGcdjit2Wa";
/* Use file ID to create job */
// const fineTune = await openai.fineTuning.jobs.create({
//     training_file: "file-MSkeJ8DRcmgFkGcdjit2Wa",
//     model: "gpt-3.5-turbo"
// })

// console.log(fineTune)

const fineTune_id = "ftjob-zuCmZZpt1n5bO0V1GwAHqmAh";
/* Check status of job */
// const fineTuneStatus = await openai.fineTuning.jobs.retrieve("ftjob-zuCmZZpt1n5bO0V1GwAHqmAh")
// console.log(fineTuneStatus)

const fineTuneModel = "ftjob-zuCmZZpt1n5bO0V1GwAHqmAh";
/* Test our fine-tuned model */
const messages = [
  {
    role: "user",
    content: "I don't know what to do with my life",
  },
];
async function getResponse() {
  const response = await openai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-0125:scrimba::96fwXrQX",
    messages: messages,
  });
  return response.choices[0].message.content;
}
console.log(await getResponse());
