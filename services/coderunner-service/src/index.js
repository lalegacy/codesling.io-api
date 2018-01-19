import { writeFile } from 'fs';
import { execFile } from 'child_process';
import express from 'express';
import bodyParser from 'body-parser';
import tmp from 'tmp';
import cors from 'cors';
// import vm from 'vm';

import log from './lib/log';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.post('/submit-code', (req, res) => {
  tmp.file({ postfix: '.js' }, (errCreatingTmpFile, path) => {
    writeFile(path, req.body.code, (errWritingFile) => {
      if (errWritingFile) {
        res.send(errWritingFile);
      } else {
        execFile('node', [path], (errExecutingFile, stdout, stderr) => {
          if (errExecutingFile) {
            let stderrFormatted = stderr.split('\n');
            stderrFormatted.shift();
            stderrFormatted = stderrFormatted.join('\n');
            res.send(stderrFormatted);
          } else {
            console.log('this is req.body: ', req.body);
            // res.write(JSON.stringify(stdout));
            /* Boolean Case
            if (typeof req.body.test === 'boolean') {
              const return = stdout.trim() === 'true' || stdout.trim() === 'false'
            }
            res.write(JSON.stringify(return));
            res.send();
            */

            /* Array case
            let match = true;
            let sampleArr = [1, 2, 3, 4]
            for (let i = 0; i < JSON.parse(this.state.stdout).length; i++) {
              console.log('here is arr stdout[i]', JSON.parse(this.state.stdout)[i]);
              console.log('here is props.tests[i]', JSON.parse(this.props.tests[0]['content'])[i]);
              console.log('at index: ', i, ' the elements equal: ', JSON.parse(this.state.stdout)[i] === JSON.parse(this.props.tests[0]['content'])[i]);
              match = JSON.parse(stdout)[i] === JSON.parse(req.body.code[0]['content'])[i] ? match : false;
            }
            */
          }
        });
      }
    });
  });
});

app.listen(PORT, log(`coderunner-service is listening on port ${PORT}`));
