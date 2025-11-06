import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export function CheckboxTest() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <div className="p-8 space-y-6 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-xl font-semibold mb-4">Checkbox Test</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
          <Checkbox
            id="test1"
            checked={checked1}
            onCheckedChange={(checked) => setChecked1(checked as boolean)}
          />
          <Label htmlFor="test1" className="cursor-pointer">
            Test 1 - Currently {checked1 ? 'CHECKED ✓' : 'UNCHECKED'}
          </Label>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
          <Checkbox
            id="test2"
            checked={checked2}
            onCheckedChange={(checked) => setChecked2(checked as boolean)}
          />
          <Label htmlFor="test2" className="cursor-pointer">
            Test 2 - Currently {checked2 ? 'CHECKED ✓' : 'UNCHECKED'}
          </Label>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
          <Checkbox
            id="test3"
            checked={checked3}
            onCheckedChange={(checked) => setChecked3(checked as boolean)}
          />
          <Label htmlFor="test3" className="cursor-pointer">
            Test 3 - Currently {checked3 ? 'CHECKED ✓' : 'UNCHECKED'}
          </Label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
        <strong>Debug Info:</strong>
        <ul className="mt-2 space-y-1">
          <li>Checkbox 1: {String(checked1)}</li>
          <li>Checkbox 2: {String(checked2)}</li>
          <li>Checkbox 3: {String(checked3)}</li>
        </ul>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Click the checkboxes above. You should see:
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>White checkmark on blue background when checked</li>
          <li>Empty white box with gray border when unchecked</li>
          <li>Label text updating to show current state</li>
        </ul>
      </div>
    </div>
  );
}
