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

export class SurrogateAwareString {
  str: string;
  index_mapping: number[];
  length: number;

  /**
   * String wrapper for UTF-16 surrogate pair (4 bytes)
   * @param {string} str String to wrap
   * @constructor
   */
  constructor(str: string) {
    this.str = str;
    this.index_mapping = [];

    for (let pos = 0; pos < str.length; pos++) {
      const ch = str.charAt(pos);
      this.index_mapping.push(pos);
      if (SurrogateAwareString.isSurrogatePair(ch)) {
        pos++;
      }
    }
    // Surrogate aware length
    this.length = this.index_mapping.length;
  }

  slice(index: number): string {
    if (this.index_mapping.length <= index) {
      return ``;
    }
    return this.str.slice(this.index_mapping[index]);
  }

  charAt(index: number): string {
    if (this.str.length <= index) {
      return ``;
    }
    const surrogate_aware_start_index = this.index_mapping[index];
    const surrogate_aware_end_index = this.index_mapping[index + 1];

    if (surrogate_aware_end_index == null) {
      return this.str.slice(surrogate_aware_start_index);
    }
    return this.str.slice(
      surrogate_aware_start_index,
      surrogate_aware_end_index
    );
  }

  charCodeAt(index: number): number {
    if (this.index_mapping.length <= index) {
      return NaN;
    }
    const surrogate_aware_index = this.index_mapping[index];
    const upper = this.str.charCodeAt(surrogate_aware_index);
    let lower: number;
    if (
      upper >= 0xd800 &&
      upper <= 0xdbff &&
      surrogate_aware_index < this.str.length
    ) {
      lower = this.str.charCodeAt(surrogate_aware_index + 1);
      if (lower >= 0xdc00 && lower <= 0xdfff) {
        return (upper - 0xd800) * 0x400 + lower - 0xdc00 + 0x10000;
      }
    }
    return upper;
  }

  toString(): string {
    return this.str;
  }

  static isSurrogatePair(ch: string): boolean {
    const utf16_code = ch.charCodeAt(0);
    if (utf16_code >= 0xd800 && utf16_code <= 0xdbff) {
      // surrogate pair
      return true;
    } else {
      return false;
    }
  }
}
