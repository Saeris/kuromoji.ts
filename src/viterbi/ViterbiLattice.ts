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
import { ViterbiNode } from "./ViterbiNode.js";

export class ViterbiLattice {
  nodes_end_at: ViterbiNode[][];
  eos_pos: number;

  /**
   * ViterbiLattice is a lattice in Viterbi algorithm
   * @constructor
   */
  constructor() {
    this.nodes_end_at = [];
    this.nodes_end_at[0] = [new ViterbiNode(-1, 0, 0, 0, `BOS`, 0, 0, ``)];
    this.eos_pos = 1;
  }

  /**
   * Append node to ViterbiLattice
   * @param {ViterbiNode} node
   */
  append(node: ViterbiNode): void {
    const last_pos = node.start_pos + node.length - 1;
    if (this.eos_pos < last_pos) {
      this.eos_pos = last_pos;
    }

    const prev_nodes = this.nodes_end_at[last_pos] ?? [];
    prev_nodes.push(node);

    this.nodes_end_at[last_pos] = prev_nodes;
  }

  /**
   * Set ends with EOS (End of Statement)
   */
  appendEos(): void {
    const last_index = this.nodes_end_at.length;
    this.eos_pos++;
    this.nodes_end_at[last_index] = [
      new ViterbiNode(-1, 0, this.eos_pos, 0, `EOS`, 0, 0, ``)
    ];
  }
}
