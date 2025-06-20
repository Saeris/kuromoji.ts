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
export type ViterbiNodeType = `KNOWN` | `UNKNOWN` | `BOS` | `EOS`;

export class ViterbiNode {
  name: number;
  cost: number;
  start_pos: number;
  length: number;
  left_id: number;
  right_id: number;
  prev: null | ViterbiNode;
  surface_form: string | Uint8Array;
  shortest_cost: number;
  type: ViterbiNodeType;

  /**
   * ViterbiNode is a node of ViterbiLattice
   * @param {number} node_name Word ID
   * @param {number} node_cost Word cost to generate
   * @param {number} start_pos Start position from 1
   * @param {number} length Word length
   * @param {string} type Node type (KNOWN, UNKNOWN, BOS, EOS, ...)
   * @param {number} left_id Left context ID
   * @param {number} right_id Right context ID
   * @param {string} surface_form Surface form of this word
   * @constructor
   */
  constructor(
    node_name: number,
    node_cost: number,
    start_pos: number,
    length: number,
    type: ViterbiNodeType,
    left_id: number,
    right_id: number,
    surface_form: string | Uint8Array
  ) {
    this.name = node_name;
    this.cost = node_cost;
    this.start_pos = start_pos;
    this.length = length;
    this.left_id = left_id;
    this.right_id = right_id;
    this.prev = null;
    this.surface_form = surface_form;
    if (type === `BOS`) {
      this.shortest_cost = 0;
    } else {
      this.shortest_cost = Number.MAX_VALUE;
    }
    this.type = type;
  }
}
