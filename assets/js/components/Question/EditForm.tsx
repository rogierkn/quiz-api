import * as React from "react";
import {FormEvent} from "react";
import {inject, observer} from "mobx-react";
import {Button, Divider, Dropdown, Form, Grid, Header, Loader, Segment, TextArea, Transition} from "semantic-ui-react";
import {debounce} from "lodash-decorators";
import Question from "../../models/Question";
import QuestionStore from "../../stores/QuestionStore";
import AnswerEditForm from "../Answer/EditForm";
import CreateButton from "../Answer/CreateButton";
import {observable} from "mobx";

interface propTypes {
    question: Question,
    questionStore?: QuestionStore,
}

@inject("questionStore") @observer
export default class EditForm extends React.Component<propTypes, any> {

    @observable saving: boolean = false;
    @observable deleting: boolean = false;

    @debounce(500)
    async save() {
        this.saving = true;
        try {
            await this.props.questionStore.save(this.props.question)
        }
        finally {
            this.saving = false;
        }
    }

    delete = () => {
        this.deleting = true;
        try {
            this.props.questionStore.delete(this.props.question)
        }
        finally {
            this.deleting = false;
        }

    };


    handleChange = (event: React.FormEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>, data: any) => {
        if (data.type === "checkbox") {
            this.props.question[data.name] = data.checked;
        } else {
            this.props.question[data.name] = data.value;
        }
        this.save();
    };

    render() {
        const question = this.props.question;
        return <Segment padded="very">
            <Form>
                <Grid columns={2} stackable reversed="mobile">
                    <Grid.Column width={10}>
                    <TextArea label="Question text" placeholder={"Question text"} name="text"
                              value={question.text}
                              onChange={this.handleChange}
                              maxLength={500}
                              rows={1}
                    />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Dropdown name="displayType" onChange={this.handleChange} value={question.displayType}
                                  placeholder='Display as' basic selection
                                  options={[{
                                      key: 'DISPLAY_BUTTON',
                                      text: "Button",
                                      value: 'DISPLAY_BUTTON'
                                  }, {
                                      key: 'DISPLAY_TILE',
                                      text: 'Tile',
                                      value: 'DISPLAY_TILE'
                                  }]}/>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign="right">
                        <Button circular icon="trash" negative onClick={this.delete} loading={this.deleting}
                                disabled={this.deleting}/>
                        <Loader active={this.saving}/>

                    </Grid.Column>
                </Grid>
                <Divider hidden/>
                <Header size="medium">Answers</Header>
                <Transition.Group
                    duration={300}
                    as={Grid}
                    stackable
                >
                    {question.answers.map(answer => <AnswerEditForm key={answer.id} answer={answer}/>)}
                </Transition.Group>
                <Divider hidden/>
                <CreateButton question={question}/>
            </Form>
        </Segment>;
    }
}