/**
 * Copyright 2017 - 2019  The Hyve B.V.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GbCombinationConstraintComponent} from './gb-combination-constraint.component';
import {AutoCompleteModule, DropdownModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {TreeNodeService} from '../../../../services/tree-node.service';
import {TreeNodeServiceMock} from '../../../../services/mocks/tree-node.service.mock';
import {ResourceService} from '../../../../services/resource.service';
import {ResourceServiceMock} from '../../../../services/mocks/resource.service.mock';
import {ConstraintService} from '../../../../services/constraint.service';
import {ConstraintServiceMock} from '../../../../services/mocks/constraint.service.mock';
import {CombinationConstraint} from '../../../../models/constraint-models/combination-constraint';
import {CohortService} from '../../../../services/cohort.service';
import {CohortServiceMock} from '../../../../services/mocks/cohort.service.mock';
import {MockComponent} from 'ng2-mock-component';
import {StudyConstraint} from '../../../../models/constraint-models/study-constraint';
import {ConceptConstraint} from '../../../../models/constraint-models/concept-constraint';
import {StudyService} from '../../../../services/study.service';
import {StudyServiceMock} from '../../../../services/mocks/study.service.mock';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';
import {AuthenticationServiceMock} from '../../../../services/mocks/authentication.service.mock';
import {Constraint} from '../../../../models/constraint-models/constraint';

describe('GbCombinationConstraintComponent', () => {
  let component: GbCombinationConstraintComponent;
  let fixture: ComponentFixture<GbCombinationConstraintComponent>;
  let constraintService: ConstraintService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GbCombinationConstraintComponent,
        MockComponent({selector: 'gb-constraint', inputs: ['constraint']})
      ],
      imports: [
        FormsModule,
        AutoCompleteModule,
        DropdownModule
      ],
      providers: [
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock
        },
        {
          provide: TreeNodeService,
          useClass: TreeNodeServiceMock
        },
        {
          provide: ResourceService,
          useClass: ResourceServiceMock
        },
        {
          provide: ConstraintService,
          useClass: ConstraintServiceMock
        },
        {
          provide: CohortService,
          useClass: CohortServiceMock
        },
        {
          provide: StudyService,
          useClass: StudyServiceMock
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GbCombinationConstraintComponent);
    component = fixture.componentInstance;
    component.constraint = new CombinationConstraint();
    fixture.detectChanges();
    constraintService = TestBed.get(ConstraintService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle dropdown action', () => {
    let c1 = new StudyConstraint();
    let c2 = new ConceptConstraint();
    let dummies = [c1, c2];
    spyOn(constraintService, 'searchAllConstraints').and.returnValue(dummies);
    let e = new MouseEvent('');
    e['originalEvent'] = new MouseEvent('');
    component.onDropdown(e);
    expect(component.searchResults).toBe(dummies);
  });

  it('should handle cohort type change action', () => {
    component.constraint = new CombinationConstraint();
    let newCohortType = 'test dimension';
    let spy1 = spyOn(component, 'update').and.callThrough();
    let spy2 = spyOn(component, 'handleCohortTypeChange').and.callThrough();

    component.constraint.dimension = newCohortType;
    component.onCohortTypeChange();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should propagate selected cohort type', () => {
    let constraint1 = new StudyConstraint();
    let constraint2 = new CombinationConstraint();
    let constraint21 = new ConceptConstraint();
    let constraint22 = new ConceptConstraint();
    constraint2.addChild(constraint21);
    constraint2.addChild(constraint22);
    component.constraint = new CombinationConstraint();
    (<CombinationConstraint>component.constraint).addChild(constraint1);
    (<CombinationConstraint>component.constraint).addChild(constraint2);

    let newCohortType = 'test dimension';

    component.constraint.dimension = newCohortType;
    component.onCohortTypeChange();

    expect((<CombinationConstraint>component.constraint).children[0].dimension).toEqual(newCohortType);
    expect((<CombinationConstraint>component.constraint).children[1].dimension).toEqual(Constraint.BASIC_DIMENSION);
    expect((<CombinationConstraint>(<CombinationConstraint>component.constraint).children[1]).children[0].dimension)
      .toEqual(Constraint.BASIC_DIMENSION);
  });

});
