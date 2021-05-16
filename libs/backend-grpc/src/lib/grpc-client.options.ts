import { ClientOptions, Transport } from '@nestjs/microservices';
import { ApiEnvironment } from '@upgraded-enigma/backend-interfaces';
import { join } from 'path';

export const GRPC_CLIENT_PACKAGE = 'GRPC_CLIENT_PACKAGE';

const localProtoPath = [join(__dirname, '..', '..', '..', 'tools/proto/root.proto')];
const functionsProtoPath = [join(__dirname, 'proto/root.proto')];

/**
 * Proto file paths.
 */
const protoPaths: (env: ApiEnvironment) => string[] = (env: ApiEnvironment) => {
  return !Boolean(env.firebase) ? [...localProtoPath] : [...functionsProtoPath];
};

const rpcUrl = '0.0.0.0:15001';

/**
 * Grpc client options.
 */
export const backendGrpcClientOptions: (env: ApiEnvironment) => ClientOptions = (env: ApiEnvironment) => ({
  transport: Transport.GRPC,
  options: {
    url: rpcUrl,
    package: ['upgradedenigma'],
    protoPath: protoPaths(env),
  },
});
