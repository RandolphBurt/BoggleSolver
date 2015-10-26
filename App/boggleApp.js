angular.module("boggleApp", [])
    .controller("appController", ["$scope", "solverService", function($scope, solverService) {
        $scope.grid = [
            ["a", "b", "e", "r"],
            ["r", "h", "s", "t"],
            ["o", "L", "g", "u"],
            ["o", "m", "a", "r"]
        ];

        $scope.calculate = function() {
            solverService.solve($scope.grid);
        };
    }])

    .factory("dictionaryService", ["dictionary", function(dictionary) {
        return {
            isWord: function(candidate) {
                return (dictionary[candidate]);
            }
        }
    }])

    .factory("solverService", ["dictionaryService", function(dictionaryService) {
        var grid = [];

        function solve(playerGrid) {
            grid = playerGrid;

            var words = [];
            var previousCells = [
                [ false, false, false, false ],
                [ false, false, false, false ],
                [ false, false, false, false ],
                [ false, false, false, false ]
            ];

            for (var row = 0; row < 4; row++) {
                for (var column = 0; column < 4; column++) {
                    words = words.concat(gridCrawl(0, 12, "", previousCells, row, column));
                }
            }

            console.log(words);
        }

        function copyGrid(o) {
            return [
                [ o[0][0], o[0][1], o[0][2], o[0][3] ],
                [ o[1][0], o[1][1], o[1][2], o[1][3] ],
                [ o[2][0], o[2][1], o[2][2], o[2][3] ],
                [ o[3][0], o[3][1], o[3][2], o[3][3] ]
            ];
        }

        function neighbouringCells(row, column) {
            var neighbours = [];

            if (row > 0) {
                neighbours.push({ row: row - 1, column: column });
                if (column > 0) {
                    neighbours.push({ row: row - 1, column: column - 1 });
                }
                if (column < 3) {
                    neighbours.push({ row: row - 1, column: column + 1 });
                }
            }

            if (column > 0) {
                neighbours.push({ row: row, column: column - 1 });
            }
            if (column < 3) {
                neighbours.push({ row: row, column: column + 1 });
            }

            if (row < 3) {
                neighbours.push({ row: row + 1, column: column });
                if (column > 0) {
                    neighbours.push({ row: row + 1, column: column - 1 });
                }
                if (column < 3) {
                    neighbours.push({ row: row + 1, column: column + 1 });
                }
            }

            return neighbours;
        }


        function gridCrawl(currentDepth, maxDepth, candidateWord, previousCells, row, column) {
            var wordsFound = [];

            var newCandidateWord = candidateWord + grid[row][column];
            var newPreviousCells = copyGrid(previousCells);
            newPreviousCells[row][column] = true;

            if (dictionaryService.isWord(newCandidateWord)) {
                wordsFound.push(newCandidateWord);
            }

            currentDepth++;

            if (currentDepth < maxDepth) {
                var neighbours = neighbouringCells(row, column);

                for (var i = 0; i < neighbours.length; i++) {
                    if (!newPreviousCells[neighbours[i].row][neighbours[i].column]) {
                        wordsFound = wordsFound.concat(gridCrawl(currentDepth, maxDepth, newCandidateWord, newPreviousCells, neighbours[i].row, neighbours[i].column));
                    }
                }
            }

            return wordsFound;
        }

        return {
            solve: solve
        }
    }]);
