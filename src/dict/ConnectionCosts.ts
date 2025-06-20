/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
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
export class ConnectionCosts {
  forward_dimension: number;
  backward_dimension: number;
  buffer: Int16Array;

  /**
   * Connection costs matrix from cc.dat file.
   * 2 dimension matrix [forward_id][backward_id] -> cost
   * @constructor
   * @param {number} forward_dimension
   * @param {number} backward_dimension
   */
  constructor(forward_dimension: number, backward_dimension: number) {
    this.forward_dimension = forward_dimension;
    this.backward_dimension = backward_dimension;

    // leading 2 integers for forward_dimension, backward_dimension, respectively
    this.buffer = new Int16Array(forward_dimension * backward_dimension + 2);
    this.buffer[0] = forward_dimension;
    this.buffer[1] = backward_dimension;
  }

  put(forward_id: number, backward_id: number, cost: number): void {
    const index = forward_id * this.backward_dimension + backward_id + 2;
    if (this.buffer.length < index + 1) {
      throw new Error(`ConnectionCosts buffer overflow`);
    }
    this.buffer[index] = cost;
  }

  get(forward_id: number, backward_id: number): number {
    const index = forward_id * this.backward_dimension + backward_id + 2;
    if (this.buffer.length < index + 1) {
      throw new Error(`ConnectionCosts buffer overflow`);
    }
    return this.buffer[index];
  }

  loadConnectionCosts(connection_costs_buffer: Int16Array): void {
    this.forward_dimension = connection_costs_buffer[0];
    this.backward_dimension = connection_costs_buffer[1];
    this.buffer = connection_costs_buffer;
  }
}
