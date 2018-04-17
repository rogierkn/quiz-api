import * as React from "react";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {CurrentAnswer} from "../../../interfaces/CurrentQuestion";
import {Button, Container, Grid, SemanticCOLORS} from "semantic-ui-react";
import AnswerColors from "../../../util/AnswerColors";
import {ButtonProps} from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import {DisplayType} from "../../../models/Question";


interface propTypes {
    answer: CurrentAnswer // Note: not actual model but mere JS object
    indexInList: number,
    toggled: boolean,
    onClick: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
    displayType: string,
}

@observer
export default class AnswerButton extends React.Component<propTypes, any> {
    render() {

        if (this.props.displayType === DisplayType.DISPLAY_TILE) {
            return <Grid.Column width={8}>
                <Button color={this.color} size="medium"
                        fluid
                        style={{
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            margin: '20px auto',
                        }}
                        className={this.props.toggled ? 'answerSelectedAnimation' : ''}
                        active={this.props.toggled}
                        onClick={this.props.onClick}>
                    <Container textAlign="left" fluid>{this.props.answer.text}</Container>
                </Button>
            </Grid.Column>;
        }

        return <Button color={this.color} size="massive"
                       fluid
                       style={{paddingTop: '20px', paddingBottom: '20px', margin: '20px auto'}}
                       className={this.props.toggled ? 'answerSelectedAnimation' : ''}
                       active={this.props.toggled}
                       onClick={this.props.onClick}>
            {this.props.answer.text}
        </Button>
    }

    /**
     * Get the color for this answer according to its index in the answer list
     * @returns {string}
     */
    @computed get color(): SemanticCOLORS {
        return AnswerColors[this.props.indexInList % AnswerColors.length] as SemanticCOLORS;
    }


}