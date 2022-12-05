/*
 * Copyright 2021 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { getVoidLogger } from '@backstage/backend-common';
import { createJsonJSONataTransformAction } from './json';
import { PassThrough } from 'stream';
import mock from 'mock-fs';
import fs from 'fs-extra';

describe('roadiehq:utils:jsonata:json:transform', () => {
  beforeEach(() => {
    mock({
      'fake-tmp-dir': {},
    });
  });
  afterEach(() => mock.restore());
  const mockContext = {
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const action = createJsonJSONataTransformAction();

  it('should write file to the workspacePath with the given transformation', async () => {
    mock({
      'fake-tmp-dir': {
        'fake-file.json': '{ "hello": ["world"] }',
      },
    });
    await action.handler({
      ...mockContext,
      workspacePath: 'fake-tmp-dir',
      input: {
        path: 'fake-file.json',
        expression: '$ ~> | $ | { "hello": [hello, "item2"] }|',
        writeOutputPath: 'updated-file.json',
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'result',
      JSON.stringify({ hello: ['world', 'item2'] }),
    );
    expect(fs.existsSync('fake-tmp-dir/updated-file.json')).toBe(true);
    const file = fs.readFileSync('fake-tmp-dir/updated-file.json', 'utf-8');
    expect(file).toEqual(JSON.stringify({ hello: ['world', 'item2'] }));
  });
});
