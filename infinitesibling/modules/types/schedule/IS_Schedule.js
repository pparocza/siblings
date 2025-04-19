import { IS_Object } from "../../types/IS_Object.js";
import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";
import { IS_ScheduleItem } from "./IS_ScheduleItem.js";
import { IS_Type } from "../../enums/IS_Type.js";

/**
 * Schedule starts and stops of Startable Nodes
 */
export class IS_Schedule extends IS_Object
{
    constructor()
    {
        super(IS_Type.IS_Data.IS_Schedule);

        this._scheduleItems = [];
        this._offset = 0;
        this._duration = null;
    }

    generateSchedule()
    {
        // TODO: procedural parameters for schedule generation
    }

    /**
     * Create an IS_ScheduleItem to schedule the playback of an IS_StartableNode
     * @param startableNode
     * @param startTime
     * @param duration
     */
    scheduleStart(schedulable, startTime = 0, duration = null)
    {
        let scheduleItem = new IS_ScheduleItem
        (
            schedulable, IS_ScheduleAction.Start, startTime, duration
        );

        this._scheduleItems.push(scheduleItem);
    }

    scheduleStop(schedulable, stopTime)
    {
        let scheduleItem = new IS_ScheduleItem
        (
            schedulable, IS_ScheduleAction.Stop, stopTime
        );

        this._scheduleItems.push(scheduleItem);
    }

    scheduleValue(schedulable, value, time, transitionTime = null)
    {
        let scheduleItem = new IS_ScheduleItem
        (
            schedulable, IS_ScheduleAction.SetValue, time, 0, value, transitionTime
        );

        this._scheduleItems.push(scheduleItem);
    }

    schedule()
    {
        while(this._scheduleItems.length > 0)
        {
            let scheduleItem = this._scheduleItems.shift();

            if (this._duration !== null)
            {
                scheduleItem.duration = Math.max(this._duration - scheduleItem.startTime, 0);
            }

            scheduleItem.startTime = this._offset + scheduleItem.startTime;

            scheduleItem.schedule(this._offset, this._duration);
        }
    }

    stop()
    {
        for (let scheduleItemIndex = 0; scheduleItemIndex < this._scheduleItems.length; scheduleItemIndex++)
        {
            this._scheduleItems[scheduleItemIndex].stop();
        }
    }
}