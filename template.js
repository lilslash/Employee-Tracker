

const template = () => {
    inquirer
    .prompt ([
        {
            type:"",
            name:"",
            message:"",
            choices: []
        }
    ]).then((answer) => {
        switch(answer.start) {
            case "":
                template()
                break;
        }
    })
}