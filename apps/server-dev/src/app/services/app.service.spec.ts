import { Test } from '@nestjs/testing';
import { ChildProcess } from 'child_process';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('resetEnvironments', () => {
    it('should return call child process spawn', () => {
      const spy = jest.spyOn(service, 'spawn');
      const child = new ChildProcess();
      spy.mockImplementation(() => child);
      service.resetEnvironments();
      child.emit('close');
      expect(spy).toHaveBeenCalled();
    });

    it('should return call child process spawn', () => {
      const spy = jest.spyOn(service, 'spawn');
      const child = new ChildProcess();
      spy.mockImplementation(() => child);
      service.resetEnvironments();
      const code = 8;
      child.emit('close', code);
      expect(spy).toHaveBeenCalled();
    });
  });
});
