/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
  private host: IVisualHost;
  private customVisual: Selection<SVGElement>;
  private userInfoContainer: Selection<SVGElement>;
  private userImage;
  private name: Selection<SVGTextElement>;
  private reviewContainer;
  private userInfoTextContainer: Selection<SVGElement>;
  private rating: Selection<SVGTextElement>;
  private data: any[] = [];
  private previousData: any[] = [];
  private currentIndex: number = 0;
  private interval: number;

  constructor(options: VisualConstructorOptions) {
    this.customVisual = d3
      .select(options.element)
      .append("div")
      .classed("customVisual", true);

    // <div class="container">
    this.userInfoContainer = this.customVisual
      .append("div")
      .classed("userInfoContainer", true);

    this.userImage = this.userInfoContainer
      .append("img")
      .classed("userImage", true);

    this.userInfoTextContainer = this.userInfoContainer
      .append("div")
      .classed("userInfoTextContainer", true);

    this.name = this.userInfoTextContainer.append("h2").classed("name", true);
    this.rating = this.userInfoTextContainer
      .append("h2")
      .classed("rating", true);

    this.reviewContainer = this.customVisual
      .append("div")
      .classed("reviewContainer", true);

    // Initialize interval but do not start yet
    this.interval = window.setInterval(() => this.updateReview(), 3000); // for time interval in seconds
  }

  public update(options: VisualUpdateOptions) {
    const dataView = options.dataViews[0];
    if (!dataView || !dataView.table) {
      return;
    }

    // Extract new data
    const newData = dataView.table.rows.map((row) => ({
      imageUrl: row[0] as string,
      name: row[1] as string,
      review: row[2] as string,
      rating: row[3] as string,
    }));

    // Only update if data has changed
    if (!this.isDataEqual(newData, this.previousData)) {
      this.data = newData;
      this.previousData = [...newData];
      this.currentIndex = 0; // Reset index when data changes
      this.render();
    }
  }

  private render() {
    if (this.data.length === 0) {
      return;
    }

    const item = this.data[this.currentIndex];

    this.userImage.attr("src", item.imageUrl);

    this.name.text(item.name);

    this.reviewContainer.html(`<div class="review-text">${item.review}</div>`);

    this.rating.text(`Rating: ${item.rating}`);

    // Set up a simple interval to cycle through data
    this.currentIndex = (this.currentIndex + 1) % this.data.length;
  }

  private updateReview() {
    this.render();
  }

  private isDataEqual(newData: any[], oldData: any[]): boolean {
    if (newData.length !== oldData.length) {
      return false;
    }
    for (let i = 0; i < newData.length; i++) {
      if (JSON.stringify(newData[i]) !== JSON.stringify(oldData[i])) {
        return false;
      }
    }
    return true;
  }
}
