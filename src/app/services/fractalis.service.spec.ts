import {inject, TestBed} from '@angular/core/testing';

import {FractalisService} from './fractalis.service';
import {AuthenticationService} from './authentication/authentication.service';
import {AuthenticationServiceMock} from './mocks/authentication.service.mock';
import {ConstraintServiceMock} from './mocks/constraint.service.mock';
import {ConstraintService} from './constraint.service';
import {ChartType} from '../models/chart-models/chart-type';
import {Chart} from '../models/chart-models/chart';
import {AppConfig} from '../config/app.config';
import {AppConfigFractalisDisabledMock, AppConfigMock} from '../config/app.config.mock';
import {FractalisDataType} from '../models/fractalis-models/fractalis-data-type';
import {FractalisEtlState} from '../models/fractalis-models/fractalis-etl-state';
import {Concept} from '../models/constraint-models/concept';
import {MessageHelper} from '../utilities/message-helper';
import {ConceptType} from '../models/constraint-models/concept-type';

describe('FractalisService', () => {

  let fractalisService: FractalisService;
  let constraintService: ConstraintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppConfig,
          useClass: AppConfigMock
        },
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock
        },
        {
          provide: ConstraintService,
          useClass: ConstraintServiceMock
        },
        FractalisService
      ]
    });
    fractalisService = TestBed.get(FractalisService);
    constraintService = TestBed.get(ConstraintService);
  });

  it('should be injected', inject([FractalisService], (service: FractalisService) => {
    expect(service).toBeTruthy();
  }));

  it('should add or recreate chart', () => {
    fractalisService.selectedChartType = ChartType.HEATMAP;
    // when there is no chart
    expect(fractalisService.charts.length).toEqual(0);
    // then new chart is added
    fractalisService.addOrRecreateChart();
    expect(fractalisService.charts.length).toEqual(1);

    // when previous chart is invalid
    fractalisService.charts[0].isValid = false;
    // then previous chart is replaced
    fractalisService.addOrRecreateChart();
    expect(fractalisService.charts.length).toEqual(1);
    expect(fractalisService.charts[0].isValid).toEqual(true);
  });

  it('should remove chart', () => {
    let chart1 = new Chart(ChartType.SCATTERPLOT);
    let chart2 = new Chart(ChartType.BOXPLOT);
    fractalisService.charts.push(chart1);
    fractalisService.charts.push(chart2);
    expect(fractalisService.charts.length).toEqual(2);
    fractalisService.removeChart(chart1);
    expect(fractalisService.charts.length).toEqual(1);
    expect(fractalisService.charts[0]).toBe(chart2);
  });

  it('should set variables invalid', () => {
    let errorMessages = ['Invalid variable'];
    fractalisService.invalidateVariables(errorMessages);
    expect(fractalisService.variablesValidationMessages).toEqual(errorMessages);
    expect(fractalisService.variablesInvalid).toEqual(true);
  });

  it('should clear validation', () => {
    let errorMessages = ['Invalid variable'];
    fractalisService.invalidateVariables(errorMessages);
    expect(fractalisService.variablesValidationMessages).toEqual(errorMessages);
    expect(fractalisService.variablesInvalid).toEqual(true);
    fractalisService.clearValidation();
    expect(fractalisService.variablesValidationMessages).toEqual([]);
    expect(fractalisService.variablesInvalid).toEqual(false);
  });

  it('should validate variable upload statuses', () => {
    let c1 = new Concept();
    c1.code = 'c1';
    let c2 = new Concept();
    c2.code = 'c2';
    let c3 = new Concept();
    c3.code = 'c3';
    let c4 = new Concept();
    c4.code = 'c4';
    let spy1 = spyOn(fractalisService, 'getLoadedVariables').and.callFake(function () {
      return {
        then: function (callback) {
          return callback(
            {
              data: {
                data_states: [
                  {
                    data_type: FractalisDataType.CATEGORICAL,
                    etl_message: '',
                    etl_state: FractalisEtlState.SUCCESS,
                    label: 'c1',
                    task_id: 'task1'
                  },
                  {
                    data_type: FractalisDataType.CATEGORICAL,
                    etl_message: '',
                    etl_state: FractalisEtlState.SUBMITTED,
                    label: 'c2',
                    task_id: 'task2'
                  },
                  {
                    data_type: FractalisDataType.CATEGORICAL,
                    etl_message: '',
                    etl_state: FractalisEtlState.FAILURE,
                    label: 'c3',
                    task_id: 'task2'
                  },
                ]
              }
            });
        }
      };
    });
    let spy2 = spyOn(MessageHelper, 'alert').and.stub();

    fractalisService.validateVariableUploadStatus(c1).then(returned => {
      expect(returned).toBe(true);
    });

    fractalisService.validateVariableUploadStatus(c2).then(returned => {
      expect(returned).toBe(false);
      expect(spy2).toHaveBeenCalledWith('error',
        'The variable cannot be selected. Uploading into Fractalis in progress. Please try again later.');
    });

    fractalisService.validateVariableUploadStatus(c3).then(returned => {
      expect(returned).toBe(false);
      expect(spy2).toHaveBeenCalledWith('error', 'The variable cannot be selected. Variable was not loaded correctly into Fractalis.');
    });

    fractalisService.validateVariableUploadStatus(c4).then(returned => {
      expect(returned).toBe(false);
      expect(spy2).toHaveBeenCalledWith('error', 'The variable cannot be selected. Variable was not loaded into Fractalis.');
    });
  });

  it('should return an error when no data loaded into fractalis', () => {
    let c1 = new Concept();
    c1.code = 'c1';
    let spy1 = spyOn(fractalisService, 'getLoadedVariables').and.callFake(function () {
      return {
        then: function (callback) {
          return callback({});
        }
      };
    });
    let spy2 = spyOn(MessageHelper, 'alert').and.stub();

    fractalisService.validateVariableUploadStatus(c1).then(returned => {
      expect(returned).toBe(false);
      expect(spy2).toHaveBeenCalledWith('error', 'The variable cannot be selected. No data loaded into Fractalis.');
    });
  });

  it('should show messages for fractalis variable loading', () => {
    const spyMessageHelper = spyOn(MessageHelper, 'alert');
    let c1 = new Concept();
    c1.code = 'QWERT';
    c1.type = ConceptType.CATEGORICAL;
    let c2 = new Concept();
    c2.code = 'WERTY';
    c2.type = ConceptType.NUMERICAL;
    let c3 = new Concept();
    c3.code = 'ASDFG';
    c3.type = ConceptType.HIGH_DIMENSIONAL;
    let c4 = new Concept();
    c4.code = 'ZXCVB';
    c4.type = ConceptType.DATE;
    let c5 = new Concept();
    c5.code = 'POIUY';
    c5.type = ConceptType.TEXT;
    constraintService.variablesUpdated.next([c1, c2, c3, c4, c5]);
    expect(spyMessageHelper).toHaveBeenCalled();
  })

});

describe('FractalisService with analysis disabled', () => {

  let fractalisService: FractalisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AppConfig,
          useClass: AppConfigFractalisDisabledMock
        },
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock
        },
        {
          provide: ConstraintService,
          useClass: ConstraintServiceMock
        },
        FractalisService
      ]
    });
    fractalisService = TestBed.get(FractalisService);
  });

  it('should be injected', inject([FractalisService], (service: FractalisService) => {
    expect(service).toBeTruthy();
  }));

  it('should disable fractalis analysis', () => {
    expect(fractalisService['F']).not.toBeTruthy();
    expect(fractalisService.isFractalisAvailable).toBe(false);
    expect(fractalisService.isPreparingCache).toBe(false);
  });


  it('should enable crosstable', () => {
    expect(fractalisService.availableChartTypes.length).toEqual(1);
    expect(fractalisService.availableChartTypes[0].label).toEqual(ChartType.CROSSTABLE);

    fractalisService.selectedChartType = ChartType.CROSSTABLE;
    expect(fractalisService.charts.length).toEqual(0);
    fractalisService.addOrRecreateChart();
    expect(fractalisService.charts.length).toEqual(1);
    expect(fractalisService.charts[0].isValid).toEqual(true);
    expect(fractalisService.charts[0].type).toEqual(ChartType.CROSSTABLE);
  });

});

