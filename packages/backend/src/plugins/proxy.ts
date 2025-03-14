/*
 * Copyright 2023 Larder Software Limited
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
import { createRouter } from '@backstage/plugin-proxy-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { Logger } from 'winston';

export default async function createPlugin({
  logger,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const winstonLogger =
    logger instanceof Logger ? logger : loggerToWinstonLogger(logger);
  return await createRouter({ logger: winstonLogger, config, discovery });
}
