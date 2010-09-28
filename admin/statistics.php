<table>
	<thead>
		<tr>
			<th>Render Time (s)</th>
			<th>Date</th>
			<th>Time</th>
			<th>Font</th>
			<th>Style</th>
			<th>Text</th>
			<th>Theme</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<?php
				if (file_exists('../resources/logs/performance.log')) {
					$logfile = file_get_contents('../resources/logs/performance.log');

					$logfile_dictionary = array(
						"\t" => '</td><td>',
						"\n" => "</td></tr>\n<tr><td>",
					);

					$logfile_table = str_replace(
									array_keys($logfile_dictionary),
									array_values($logfile_dictionary),
									$logfile
					);

					echo $logfile_table;
				} else {
					echo 'No logfile available';
				}
				?>
			</td>
		</tr>
	</tbody>
</table>