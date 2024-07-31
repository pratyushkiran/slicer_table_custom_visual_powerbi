import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private host;
    private customVisual;
    private userInfoContainer;
    private userImage;
    private name;
    private reviewContainer;
    private userInfoTextContainer;
    private rating;
    private data;
    private previousData;
    private currentIndex;
    private interval;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private render;
    private updateReview;
    private isDataEqual;
}
