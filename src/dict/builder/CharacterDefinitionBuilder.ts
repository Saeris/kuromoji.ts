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
import type { CategoryMapping } from "../../types.js";
import type { CharacterClass } from "../CharacterClass.js";
import { CharacterDefinition } from "../CharacterDefinition.js";
import { InvokeDefinitionMap } from "../InvokeDefinitionMap.js";

const CATEGORY_DEF_PATTERN = /^(\w+)\s+(\d)\s+(\d)\s+(\d)/;
const CATEGORY_MAPPING_PATTERN =
  /^(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;
const RANGE_CATEGORY_MAPPING_PATTERN =
  /^(0x[0-9A-F]{4})\.\.(0x[0-9A-F]{4})(?:\s+([^#\s]+))(?:\s+([^#\s]+))*/;

export class CharacterDefinitionBuilder {
  char_def: CharacterDefinition;
  character_category_definition: CharacterClass[];
  category_mapping: CategoryMapping[];

  /**
   * CharacterDefinitionBuilder
   * @constructor
   */
  constructor() {
    this.char_def = new CharacterDefinition();
    this.char_def.invoke_definition_map = new InvokeDefinitionMap();
    this.character_category_definition = [];
    this.category_mapping = [];
  }

  putLine(line: string): void {
    var parsed_category_def = CATEGORY_DEF_PATTERN.exec(line);
    if (parsed_category_def != null) {
      var class_id = this.character_category_definition.length;
      var char_class = CharacterDefinition.parseCharCategory(
        class_id,
        parsed_category_def
      );
      if (char_class == null) {
        return;
      }
      this.character_category_definition.push(char_class);
      return;
    }
    var parsed_category_mapping = CATEGORY_MAPPING_PATTERN.exec(line);
    if (parsed_category_mapping != null) {
      var mapping = CharacterDefinition.parseCategoryMapping(
        parsed_category_mapping
      );
      this.category_mapping.push(mapping);
    }
    var parsed_range_category_mapping =
      RANGE_CATEGORY_MAPPING_PATTERN.exec(line);
    if (parsed_range_category_mapping != null) {
      var range_mapping = CharacterDefinition.parseRangeCategoryMapping(
        parsed_range_category_mapping
      );
      this.category_mapping.push(range_mapping);
    }
  }

  build(): CharacterDefinition {
    this.char_def.invoke_definition_map?.init(
      this.character_category_definition
    );
    this.char_def.initCategoryMappings(this.category_mapping);
    return this.char_def;
  }
}
