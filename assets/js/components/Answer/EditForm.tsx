import * as React from "react";
import {inject, observer} from "mobx-react";
import {Button, Checkbox, Divider, Grid, Input, Responsive, TextArea} from "semantic-ui-react";
import {observable} from "mobx";
import {debounce} from "lodash-decorators";
import Answer from "../../models/Answer";
import AnswerStore from "../../stores/AnswerStore";
import {FormEvent} from "react";

interface propTypes {
    answer: Answer,
    answerStore?: AnswerStore,
    className? :string
}

@inject("answerStore") @observer
export default class EditForm extends React.Component<propTypes, any> {

    @observable saving: boolean = false;
    @observable deleting: boolean = false;

    @debounce(500)
    save(): void {
        this.saving = true;
        try {
            this.props.answerStore.save(this.props.answer)
        }
        finally {
            this.saving = false;
        }

    }

    delete = async () => {
        this.deleting = true;
        try {
            this.props.answerStore.delete(this.props.answer)
        }
        finally {
            this.deleting = false
        }

    };


    handleChange = (event: React.FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>, data: any) => {
        if (data.type === "checkbox") {
            this.props.answer[data.name] = data.checked;
        } else {
            this.props.answer[data.name] = data.value;
        }
        this.save();
    };

    render() {
        const answer = this.props.answer;
        return <Grid.Row className={this.props.className} verticalAlign="middle">
            <Grid.Column width={12}>
                <TextArea rows={1}  placeholder={"CurrentAnswer text"} name="text"
                       value={answer.text}
                       onChange={this.handleChange}
                       maxLength={250}
                       />
            </Grid.Column>
            <Grid.Column width={4}>
                <Grid columns={2}>
                    <Grid.Column>
                        <Checkbox toggle label={"Correct"} checked={answer.correct}
                                  name="correct" value={1}
                                  onChange={this.handleChange}/>

                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button circular icon="trash" negative size="mini" onClick={this.delete} loading={this.deleting}
                                disabled={this.deleting}/>
                    </Grid.Column>
                </Grid>


            </Grid.Column>
            <Responsive as={Divider} hidden {...Responsive.onlyMobile}/>
        </Grid.Row>;
    }
}