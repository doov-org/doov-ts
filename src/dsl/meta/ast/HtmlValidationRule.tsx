import * as React from 'react';
import { GetHtml } from './HtmlCondition';
import { ValidationRuleMetadata } from '../ValidationRuleMetadata';

export interface HtmlValidationRuleProps {
  metadata: ValidationRuleMetadata;
}

export class HtmlValidationRule extends React.Component<HtmlValidationRuleProps> {
  private metadata: ValidationRuleMetadata;
  constructor(props: HtmlValidationRuleProps) {
    super(props);
    this.metadata = props.metadata;
  }
  render() {
    return (
      <div className="dsl-validation-rule">
        <span className="dsl-token-when">Lorsque</span>
        <GetHtml metadata={this.metadata.when.metadata} />
        <span className="dsl-token-validate">Valider</span>
      </div>
    );
  }
}
