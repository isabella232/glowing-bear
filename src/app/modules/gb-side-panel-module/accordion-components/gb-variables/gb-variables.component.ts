import {Component, OnInit} from '@angular/core';
import {FileImportHelper} from '../../../../utilities/file-import-helper';
import {MessageHelper} from '../../../../utilities/message-helper';
import {VariablesViewMode} from '../../../../models/variables-view-mode';
import {SelectItem} from 'primeng/api';
import {NavbarService} from '../../../../services/navbar.service';
import {ConstraintService} from '../../../../services/constraint.service';

@Component({
  selector: 'gb-variables',
  templateUrl: './gb-variables.component.html',
  styleUrls: ['./gb-variables.component.css']
})
export class GbVariablesComponent implements OnInit {

  public VariablesViewMode = VariablesViewMode; // make enum visible in template
  public readonly fileElementId: string = 'variablesCriteriaFileUpload';

  private isUploadListenerNotAdded: boolean;
  file: File; // holds the uploaded cohort file

  private _availableViewModes: SelectItem[];

  constructor(private constraintService: ConstraintService,
              private navbarService: NavbarService) {
    this.isUploadListenerNotAdded = true;
    this.viewMode = VariablesViewMode.TREE_VIEW;
    this.availableViewModes = this.listAvailableViewModes();
  }

  ngOnInit() {
  }

  importVariables() {
    MessageHelper.alert('info', 'File upload started. Processing...');
    let reader = new FileReader();
    reader.onload = this.handleVariablesFileUploadEvent.bind(this);
    FileImportHelper.importCriteria(this.fileElementId, reader, this.isUploadListenerNotAdded);
    this.isUploadListenerNotAdded = false;
  }

  handleVariablesFileUploadEvent(e) {
    let data = e.target['result'];
    this.file = FileImportHelper.getFile(this.fileElementId);
    // file.type is empty for some browsers and Windows OS
    if (FileImportHelper.isJsonFile(this.file)) {
      let _json = JSON.parse(data);
      if (_json['names']) {
        this.constraintService.importVariablesByNames(_json['names']);
      } else if (_json['paths']) {
        this.constraintService.importVariablesByPaths(_json['paths']);
      } else {
        MessageHelper.alert('error', 'Invalid file content for variables import.');
        return;
      }
    } else {
      MessageHelper.alert('error', 'Invalid file format for variables import.');
      return;
    }
    MessageHelper.alert('info', 'File upload finished successfully!');
  }

  private listAvailableViewModes(): SelectItem[] {
    return Object.keys(VariablesViewMode).map(c => {
      return {
        label: VariablesViewMode[c],
        value: VariablesViewMode[c]}
    }) as SelectItem[];
  }

  get viewMode(): VariablesViewMode {
    return this.constraintService.variablesViewMode;
  }

  set viewMode(value: VariablesViewMode) {
    this.constraintService.variablesViewMode = value;
  }

  get availableViewModes(): SelectItem[] {
    return this._availableViewModes;
  }

  set availableViewModes(value: SelectItem[]) {
    this._availableViewModes = value;
  }

  get isExport(): boolean {
    return this.navbarService.isExport;
  }

}