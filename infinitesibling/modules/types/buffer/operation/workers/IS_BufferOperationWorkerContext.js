import wasmInit, { is_wasm_buffer_operation } from "../../../../../pkg/wasm_sibling.js";
const rustWasm = await wasmInit("../../../../../pkg/wasm_sibling_bg.wasm");
import { IS_WASMOperationData } from "./IS_WASMOperationData.js";
import { IS_WASMCompletedOperationData } from "./IS_WASMCompletedOperationData.js"

function INITIALIZE_MESSAGE_LISTENER()
{
	addEventListener
	(
		"message",
		(operationWASMRequestMessage) =>
		{
			MESSAGE_LISTENER_CALLBACK(operationWASMRequestMessage);
		}
	);
}

INITIALIZE_MESSAGE_LISTENER();

function MESSAGE_LISTENER_CALLBACK(operationWASMRequestMessage)
{
	if (operationWASMRequestMessage.data.request === "operate")
	{
		WORKER(operationWASMRequestMessage.data.operationRequests);
	}
}

function WORKER(operationWASMRequestMessage)
{
	let completedOperationData = DO_WORK(operationWASMRequestMessage);
	postMessage( { operationData: completedOperationData } );
}

function DO_WORK(operationWASMRequestMessage)
{
	let operationRequests = operationWASMRequestMessage.operationRequests;
	let WASMOperationData = [];
	let previousChannelNumber = operationRequests[0].channelNumber;

	let completedOperationData = new IS_WASMCompletedOperationData
	(
		operationWASMRequestMessage.bufferUUID
	);

	// TODO: This can probably be a bit cleaner
	for(let operationIndex = 0; operationIndex < operationRequests.length; operationIndex++)
	{
		let operationData = operationRequests[operationIndex];
		let currentChannelNumber = operationData.channelNumber;

		if(currentChannelNumber === previousChannelNumber)
		{
			let wasmOperationData = new IS_WASMOperationData(operationData);
			WASMOperationData.push(wasmOperationData);
		}
		else
		{
			completedOperationData.completedArrays[previousChannelNumber] =
				is_wasm_buffer_operation(operationWASMRequestMessage.bufferLength, WASMOperationData);

			let wasmOperationData = new IS_WASMOperationData(operationData);
			WASMOperationData.push(wasmOperationData);
		}

		previousChannelNumber = currentChannelNumber;
	}

	completedOperationData.completedArrays[previousChannelNumber] =
		is_wasm_buffer_operation(operationWASMRequestMessage.bufferLength, WASMOperationData);

	return completedOperationData;
}