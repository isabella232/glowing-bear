import {Component, OnInit} from '@angular/core';
import {TreeNodeService} from '../../services/tree-node.service';
import {ConstraintService} from '../../services/constraint.service';

@Component({
  selector: 'gb-data-selection',
  templateUrl: './gb-data-selection.component.html',
  styleUrls: ['./gb-data-selection.component.css']
})
export class GbDataSelectionComponent implements OnInit {

  private _queryName: string;

  constructor(public constraintService: ConstraintService) {
    this.queryName = '';
  }

  ngOnInit() {
  }

  /**
   * The event handler for the accordion tab open event,
   * to access the accordion, use event.index
   * @param event
   */
  openAccordion(event) {
  }

  /**
   * The event handler for the accordion tab close event,
   * to access the accordion, use event.index
   * @param event
   */
  closeAccordion(event) {
  }

  /**
   * Prevent the default behavior of node drop
   * @param event
   */
  preventNodeDrop(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  saveQuery() {
    let name = this.queryName ? this.queryName.trim() : '';
    let queryNameIsValid = name !== '';
    if (queryNameIsValid) {
      this.constraintService.saveQuery(name);
      this.queryName = '';
    } else {
      const summary = 'Please specify the query name.';
      this.constraintService.alertMessages.length = 0;
      this.constraintService.alertMessages.push({severity: 'warn', summary: summary, detail: ''});
    }
  }

  numberWithCommas(x: number): string {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return '0';
    }

  }

  public singularOrPlural(noun: string, number: string) {
    if (number === '1' || number === '0') {
      return noun;
    } else if (noun === 'study') {
      return 'studies';
    } else {
      return noun + 's';
    }
  }

  get patientCount_1(): string {
    return this.numberWithCommas(this.constraintService.patientCount_1);
  }

  get observationCount_1(): string {
    return this.numberWithCommas(this.constraintService.observationCount_1);
  }

  get conceptCount_1(): string {
    return this.numberWithCommas(this.constraintService.conceptCount_1);
  }

  get studyCount_1(): string {
    return this.numberWithCommas(this.constraintService.studyCount_1);
  }

  get patientCount_2(): string {
    return this.numberWithCommas(this.constraintService.patientCount_2);
  }

  get observationCount_2(): string {
    return this.numberWithCommas(this.constraintService.observationCount_2);
  }

  get conceptCount_2(): string {
    return this.numberWithCommas(this.constraintService.conceptCount_2);
  }

  get studyCount_2(): string {
    return this.numberWithCommas(this.constraintService.studyCount_2);
  }

  get queryName(): string {
    return this._queryName;
  }

  set queryName(value: string) {
    this._queryName = value;
  }
}