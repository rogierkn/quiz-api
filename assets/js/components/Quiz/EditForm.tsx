import * as React from "react";
import {inject, observer} from "mobx-react";
import {Checkbox, Grid, Input, Loader} from "semantic-ui-react";
import Quiz from "../../models/Quiz";
import QuizStore from "../../stores/QuizStore";
import {observable} from "mobx";
import {debounce} from "lodash-decorators";

interface propTypes {
    quiz: Quiz,
    quizStore?: QuizStore,
}

@inject("quizStore") @observer
export default class EditForm extends React.Component<propTypes, any> {

    @observable saving: boolean = false;


    constructor(props: propTypes) {
        super(props);
    }

    @debounce(500)
    save(): void {
        this.saving = true;
        try {
            this.props.quizStore.save(this.props.quiz)
        }
        finally {
            this.saving = false;
        }
    }

    validates() {
        if(this.props.quiz.name.trim() === "") return false;

        return true;
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>, data: any) => {
        if (data.type === "checkbox") {
            this.props.quiz[data.name] = data.checked;
        } else {
            this.props.quiz[data.name] = data.value;
        }
        if (this.validates()) this.save();
    };

    render() {
        const quiz = this.props.quiz;
        return <Grid verticalAlign={"middle"} stackable>
            <Grid.Column width={7}>
                <Input label="Quiz name" fluid={true} placeholder={"Quiz name"} name="name" value={quiz.name} onChange={this.handleChange}
                       maxLength={100}
                       error={quiz.name.trim().length < 3}/>
            </Grid.Column>
            <Grid.Column width={7}>
                <Grid columns={1} verticalAlign="middle">
                    <Grid.Column width={2}>
                        <Loader active={this.saving} inline={"centered"}/>
                    </Grid.Column>
                </Grid>
            </Grid.Column>

        </Grid>;
    }
}