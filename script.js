import { InfiniteSibling } from "../node_modules/infinitesibling";
export const IS = new InfiniteSibling();

function load()
{
    IS.load();
}

function start()
{
    IS.start();
}

function stop()
{
    IS.stop();
}

export { load, start, stop };