var offlineBuffer;
var piece;

setTimeout(function(){bufferLoaded();}, 1000);

function bufferLoaded()
{

	piece = new Piece();
	piece.initMasterChannel();
	piece.initFXChannels();
	piece.load();
}

function runPatch()
{
		piece.start();
}

function stopPatch()
{
	piece.stop();
}
