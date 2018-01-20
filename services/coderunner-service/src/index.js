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
            let expectedOut;
            let expectedType;
            if (((req.body.tests[0].type === 'output').toString()) === 'true') {
              expectedOut = req.body.tests[0].content;
              expectedType = req.body.tests[1].content;
            } else if (((req.body.tests[1].type === 'output').toString()) === 'true') {
              expectedOut = req.body.tests[1].content;
              expectedType = req.body.tests[0].content;
            } else {
              expectedOut = '';
              expectedType = '';
            }
            if (expectedType === 'string') {
              const rs = (stdout.trim() === expectedOut.trim()).toString();
              res.write(JSON.stringify(rs));
              res.send();
            } else if (expectedType === 'number') {
              // typeof parseInt(stdout.trim(), 10)); // number
              // typeof parseInt(expectedOut.trim(), 10)); // number
              const rs = (stdout.trim() === expectedOut.trim()).toString();
              res.write(JSON.stringify(rs));
              res.send();
            } else if (expectedType === 'boolean') {
              const rs = (stdout.trim() === expectedOut.trim()).toString();
              res.write(JSON.stringify(rs));
              res.send();
            } else if (expectedType === 'array') {
              // Array.isArray(JSON.parse(stdout));
              // Array.isArray(JSON.parse(expectedOut));
              let elementsAreEqual = true;
              for (let i = 0; i < JSON.parse(stdout).length; i += 1) {
                elementsAreEqual = JSON.parse(stdout)[i] === JSON.parse(expectedOut)[i] ?
                  elementsAreEqual
                  :
                  false;
              }
              res.write(JSON.stringify(elementsAreEqual.toString()));
              res.send();
            } else if (expectedType === 'object') {
              let areObjsEqual = true;
              const so = eval(`(${stdout})`);
              const eo = eval(`(${expectedOut})`);
              const ks = Object.keys(so);
              ks.forEach((key) => {
                areObjsEqual = so[key] === eo[key] ? areObjsEqual : false;
              });
              res.write(JSON.stringify(areObjsEqual.toString()));
              res.send();
            } else {
              res.write('bad test');
              res.send();
            }
          }
        });
      }
    });
  });
});

app.listen(PORT, log(`coderunner-service is listening on port ${PORT}`));
