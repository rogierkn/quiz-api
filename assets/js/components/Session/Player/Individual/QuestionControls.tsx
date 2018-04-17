import * as React from "react";
import {observer} from "mobx-react";
import {Button} from "semantic-ui-react";
import IndividualPlayerSessionService from "../../../../services/IndividualPlayerSessionService";


interface propTypes {
    sessionService: IndividualPlayerSessionService,
}

@observer
export default class QuestionControls extends React.Component<propTypes, any> {


    render() {
        return <Button.Group>
            <Button
                loading={this.props.sessionService.submitActivityRequestBusy && this.props.sessionService.selectedAnswerIri !== null}
                positive
                disabled={this.props.sessionService.selectedAnswerIri === null}
                onClick={this.props.sessionService.nextQuestion}>
                Submit answer
            </Button>
            <Button
                loading={this.props.sessionService.submitActivityRequestBusy && this.props.sessionService.selectedAnswerIri === null} // These conditions allow showing only the clicked button to be in the loading state
                disabled={this.props.sessionService.submitActivityRequestBusy && this.props.sessionService.selectedAnswerIri !== null}
                negative
                onClick={this.props.sessionService.skipQuestion}>
                Skip question
            </Button>
        </Button.Group>;
    }
}